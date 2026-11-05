import { Composition } from "remotion";
import { AppleADay, AppleADayProps, calculateMetadata } from "./AppleADay";
import { BASE_SECONDS, FPS } from "./script";
import { calculateMetadata as calculateFolge3, Folge3Diamant, FOLGE3_DEFAULTS } from "./Folge3Diamant";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppleADay"
        component={AppleADay}
        durationInFrames={BASE_SECONDS * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverSeconds: null, sceneSeconds: null, wordStarts: null, hasVoiceover: false, hasMusic: false } satisfies AppleADayProps}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="Folge3Diamant"
        component={Folge3Diamant}
        durationInFrames={42 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={FOLGE3_DEFAULTS}
        calculateMetadata={calculateFolge3}
      />
    </>
  );
};
