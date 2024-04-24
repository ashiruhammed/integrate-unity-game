import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
import { memo } from "react"
const ProductIcon = (props: SvgProps) => (
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
                d="M10.496 4.667H9.33a1.167 1.167 0 0 1 0-2.333h9.333a1.167 1.167 0 0 1 0 2.333h-1.167v6.57l6.099 8.96c1.58 2.325-.084 5.47-2.894 5.47H7.291c-2.811 0-4.475-3.145-2.893-5.47l6.098-8.96v-6.57Zm4.667 0H12.83v6.57c0 .468-.142.925-.405 1.312L6.328 21.51a1.166 1.166 0 0 0 .965 1.824H20.7a1.167 1.167 0 0 0 .965-1.824l-6.098-8.96a2.334 2.334 0 0 1-.404-1.315V4.668Z"
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
const Memo = memo(ProductIcon)
export default Memo
