import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
import { memo } from "react"
const LearnSVG = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Path
                fill="#fff"
                d="M21.005 2.333a2.333 2.333 0 0 1 2.334 2.333V19.82c0 .196-.045.375-.132.55l-.636 1.272a1.167 1.167 0 0 0 0 1.044l.633 1.27a1.166 1.166 0 0 1-1.032 1.709h-14a3.5 3.5 0 0 1-3.5-3.5V5.833a3.5 3.5 0 0 1 3.5-3.5h12.833Zm-.69 18.666H8.171a1.167 1.167 0 0 0-.137 2.325l.137.008h12.142a3.502 3.502 0 0 1-.079-2.079l.08-.254Zm.69-16.333H8.172a1.167 1.167 0 0 0-1.159 1.03l-.008.137v13.031a3.53 3.53 0 0 1 .923-.19l.244-.008h12.833v-14Zm-4.666 3.5a1.167 1.167 0 0 1 .136 2.325l-.137.008h-4.666a1.167 1.167 0 0 1-.137-2.325l.137-.008h4.666Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h28v28H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
const Memo = memo(LearnSVG)
export default Memo
