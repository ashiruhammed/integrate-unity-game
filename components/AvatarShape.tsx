import * as React from "react"
import Svg, {SvgProps, G, Path, Defs, Polygon, Line} from "react-native-svg"

/* SVGR has dropped some elements not supported by react-native-svg: filter */

const AvatarShape = (props: SvgProps) => (
    <Svg
        width={75}
        height={76}
        viewBox="0 0 75 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G filter="url(#filter0_d_457_38282)">
            <Path
                d="M38 9L54.2635 15.7365L61 32L54.2635 48.2635L38 55L21.7365 48.2635L15 32L21.7365 15.7365L38 9Z"
                fill="white"
            />
        </G>
        <Defs></Defs>
    </Svg>
)

export default AvatarShape
