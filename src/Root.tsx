import { Composition, Still } from "remotion";
import { AppleADay, AppleADayProps, calculateMetadata } from "./AppleADay";
import { BASE_SECONDS, FPS } from "./script";
import { calculateMetadata as calculateFolge4, Folge4Zucker, FOLGE4_DEFAULTS } from "./Folge4Zucker";
import { calculateMetadata as calculateFolge4Story, Folge4Story } from "./Folge4Story";
import { Folge3Story } from "./folge3/StoryImage";
import { calculateMetadata as calculateFolge5, Folge5Fackeln } from "./Folge5Fackeln";
import { Folge5Story } from "./folge5/StoryImage";
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
      <Composition
        id="Folge4Zucker"
        component={Folge4Zucker}
        durationInFrames={50 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={FOLGE4_DEFAULTS}
        calculateMetadata={calculateFolge4}
      />
      <Composition
        id="Folge4Zucker3D"
        component={Folge4Zucker}
        durationInFrames={50 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ ...FOLGE4_DEFAULTS, variant: "3d" as const }}
        calculateMetadata={calculateFolge4}
      />
      <Composition
        id="Folge4Story"
        component={Folge4Story}
        durationInFrames={55 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ total: 55 }}
        calculateMetadata={calculateFolge4Story}
      />
      <Composition
        id="Folge5Fackeln"
        component={Folge5Fackeln}
        durationInFrames={50 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ total: 50 }}
        calculateMetadata={calculateFolge5}
      />
      <Still id="Folge3Story" component={Folge3Story} width={1080} height={1920} />
      <Still id="Folge5Story" component={Folge5Story} width={1080} height={1920} />
    </>
  );
};
