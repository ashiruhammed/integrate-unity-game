
import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        {...props}
    >
        <Path
            fill={props.color}
            fillRule="evenodd"
            d="M8.1 1.988a1.5 1.5 0 0 1 1.8 0l5.25 3.937a1.5 1.5 0 0 1 .6 1.2v7.125a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V7.125a1.5 1.5 0 0 1 .6-1.2L8.1 1.987Zm.9 1.2L3.75 7.124v7.125h10.5V7.125L9 3.187Z"
            clipRule="evenodd"
        />
    </Svg>
)
const Memo = memo(SvgComponent)
export default Memo
