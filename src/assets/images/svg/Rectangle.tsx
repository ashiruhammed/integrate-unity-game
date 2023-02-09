import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const Rectangle = (props: SvgProps) => (
    <Svg

        width={props.width}
        height={props.height}
        fill="none"
        {...props}
    >
        <Path
            fill="#D90429"
            d="M10.385 35h123.23L144 17.5 133.615 0H10.385L0 17.5 10.385 35Z"
        />
    </Svg>
)

export default Rectangle
