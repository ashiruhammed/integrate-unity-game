import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={19}
        height={18}
        fill="none"
        {...props}
    >
        <G      fill={props.color} clipPath="url(#a)">
            <Path d="M13.25 9.75a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z" />
            <Path
                fillRule="evenodd"
                d="m4.11 4.295 8.25-2.357a1.875 1.875 0 0 1 2.39 1.803V4.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5V6c0-.783.626-1.494 1.36-1.704Zm8.662-.915a.375.375 0 0 1 .478.36v.76H8.855l3.917-1.12ZM4.25 6h10.5v7.5H4.25V6Z"
                clipRule="evenodd"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M.5 0h18v18H.5z" />
            </ClipPath>
        </Defs>
    </Svg>
)
const Memo = memo(SvgComponent)
export default Memo
