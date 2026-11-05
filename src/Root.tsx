import { Composition } from "remotion";
import { AppleADay, AppleADayProps, calculateMetadata } from "./AppleADay";
import { BASE_SECONDS, FPS } from "./script";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AppleADay"
      component={AppleADay}
      durationInFrames={BASE_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ voiceoverSeconds: null, hasVoiceover: false, hasMusic: false } satisfies AppleADayProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
