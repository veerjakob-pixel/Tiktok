import { Composition, Still } from "remotion";
import { AppleADay, AppleADayProps, calculateMetadata } from "./AppleADay";
import { BASE_SECONDS, FPS } from "./script";
import { calculateMetadata as calculateFolge4, Folge4Zucker, FOLGE4_DEFAULTS } from "./Folge4Zucker";
import { calculateMetadata as calculateFolge4Story, Folge4Story } from "./Folge4Story";
import { Folge3Story } from "./folge3/StoryImage";
import { calculateMetadata as calculateFolge5, Folge5Fackeln } from "./Folge5Fackeln";
import { Folge5Story } from "./folge5/StoryImage";
import { calculateMetadata as calculateFolge6, Folge6Weihnachtsmann } from "./Folge6Weihnachtsmann";
import { Folge6Story } from "./folge6/StoryImage";
import { ModelCheck } from "./folge6/Check";
import { calculateMetadata as calculateFolge7, Folge7Listerine } from "./Folge7Listerine";
import { Folge7Story } from "./folge7/StoryImage";
import { calculateMetadata as calculateFolge8, Folge8Kaffeepause } from "./Folge8Kaffeepause";
import { Folge8Story } from "./folge8/StoryImage";
import { ModelCheck8 } from "./folge8/Check";
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
      <Composition
        id="Folge6Weihnachtsmann"
        component={Folge6Weihnachtsmann}
        durationInFrames={50 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ total: 50 }}
        calculateMetadata={calculateFolge6}
      />
      <Still id="Folge3Story" component={Folge3Story} width={1080} height={1920} />
      <Still id="Folge5Story" component={Folge5Story} width={1080} height={1920} />
      <Composition
        id="Folge7Listerine"
        component={Folge7Listerine}
        durationInFrames={45 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ total: 45 }}
        calculateMetadata={calculateFolge7}
      />
      <Still id="Folge7Story" component={Folge7Story} width={1080} height={1920} />
      <Composition
        id="Folge8Kaffeepause"
        component={Folge8Kaffeepause}
        durationInFrames={45 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ total: 45 }}
        calculateMetadata={calculateFolge8}
      />
      <Still id="Folge8Story" component={Folge8Story} width={1080} height={1920} />
      <Still id="ModelCheck8" component={ModelCheck8} width={540} height={960} defaultProps={{ view: "front" }} />
      <Still id="ModelCheck" component={ModelCheck} width={540} height={960} defaultProps={{ view: "front", laugh: 0 }} />
      <Still id="Folge6Story" component={Folge6Story} width={1080} height={1920} />
    </>
  );
};
