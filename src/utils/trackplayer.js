import TrackPlayer, {
  Capability,
  Event,
  State,
} from "react-native-track-player";

export const setupTrackPlayer = async () => {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrack();
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
    isSetup = true;
  } finally {
    return isSetup;
  }
};

// function to check if trackplayer is setup
export const isTrackPlayerSetup = async () => {
  try {
    await TrackPlayer.getActiveTrack();
    return true;
  } catch (error) {
    return false;
  }
};
