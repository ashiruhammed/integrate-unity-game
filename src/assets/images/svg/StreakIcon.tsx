import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
import { memo } from "react"
const StreakIcon = (props: SvgProps) => (
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
                fillRule="evenodd"
                d="M19.385 3.5a2.333 2.333 0 0 1 2.316 2.044L21.883 7h.78a2.671 2.671 0 0 1 2.62 3.197l-.235 1.172a4.726 4.726 0 0 1-3.467 3.652 8.382 8.382 0 0 1-6.417 4.732v2.414h3.5a1.167 1.167 0 1 1 0 2.333H9.332a1.167 1.167 0 1 1 0-2.333h3.5v-2.414a8.38 8.38 0 0 1-6.414-4.732 4.725 4.725 0 0 1-3.468-3.652l-.234-1.174A2.672 2.672 0 0 1 5.336 7h.778l.182-1.456A2.333 2.333 0 0 1 8.612 3.5h10.773Zm0 2.333H8.612l-.61 4.875a6.043 6.043 0 1 0 11.993 0l-.61-4.875Zm3.279 3.5h-.49l.136 1.085c.058.474.078.943.058 1.404.152-.214.269-.453.343-.712l.05-.198.233-1.174a.338.338 0 0 0-.253-.396l-.077-.009Zm-16.842 0h-.488A.338.338 0 0 0 5 9.738l.235 1.173c.068.337.203.645.392.91-.02-.46 0-.929.058-1.403l.136-1.085Z"
                clipRule="evenodd"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h28v28H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
const Memo = memo(StreakIcon)
export default Memo
