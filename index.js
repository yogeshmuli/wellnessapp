/**
 * @format
 */

import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import App from "./App";
import { name as appName } from "./app.json";
import TrackPlayerService from "./src/service/trackplayer.service";
import TrackPlayer from "react-native-track-player";

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => TrackPlayerService);
