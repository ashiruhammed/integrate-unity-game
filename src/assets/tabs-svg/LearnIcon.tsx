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
        <G clipPath="url(#a)">
            <Path
                fill={props.color}
                d="M14.004 1.5a1.5 1.5 0 0 1 1.5 1.5v9.742a.775.775 0 0 1-.085.354l-.409.817a.75.75 0 0 0 0 .672l.408.816a.75.75 0 0 1-.664 1.098h-9a2.25 2.25 0 0 1-2.25-2.25V3.75a2.25 2.25 0 0 1 2.25-2.25h8.25Zm-.444 12H5.754a.75.75 0 0 0-.088 1.494l.088.005h7.806a2.251 2.251 0 0 1-.051-1.336l.05-.164ZM14.004 3h-8.25a.75.75 0 0 0-.745.662l-.005.087v8.378c.187-.066.387-.108.593-.122l.157-.006h8.25V3Zm-3 2.25a.75.75 0 0 1 .088 1.494l-.088.005h-3a.75.75 0 0 1-.088-1.494l.088-.006h3Z"
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
