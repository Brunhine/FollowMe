import { FollowHud } from "./module/followhud.js";
import { Settings } from "./module/settings.js";
import { FollowManager } from "./module/followmanager.js";
import { socketName, socketAction } from "./module/socketinfo.js";
import { findTokenById } from "./module/utils.js";

Hooks.on('ready', () => {
    Settings.registerSettings();

    game.socket.on(socketName, data => {
        if (game.user.isGM) {
            switch (data.mode) {
                case socketAction.StartFollow:
                    FollowManager.startFollowing(data.followerId, data.leaderId);
                    break;
                case socketAction.StopFollow:
                    FollowManager.stopFollowing(data.followerId);
                    break;
                case socketAction.MoveToken:
                    findTokenById(data.tokenId).update({
                        x: data.x,
                        y: data.y
                    });
                    break;
            }
        }
    });
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    FollowHud.renderFollowHud(app, html, data);
});

Hooks.on('preUpdateToken', (scene, token, updateData) => {
    if (updateData.x || updateData.y) FollowManager.summonFollower(token, updateData.x, updateData.y);
});