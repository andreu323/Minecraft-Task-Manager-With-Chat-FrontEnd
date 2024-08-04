
import Join from "./message_types/join.svelte";
import Leave from "./message_types/leave.svelte";
import Default from "./message_types/default.svelte";
import PointsReward from "./message_types/points_reward.svelte";
import Kick from "./message_types/kick.svelte";
import Block from "./message_types/block.svelte";
import Unblock from "./message_types/unblock.svelte";
export var message_types = {
    "join":Join,
    "leave":Leave,
    "default":Default,
    "points_reward":PointsReward,
    "kick":Kick,
    "unblock":Unblock,
    "block":Block
}