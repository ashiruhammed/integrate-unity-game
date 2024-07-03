import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={62}
        height={62}
        fill="none"
        {...props}
    >
        <Path
            stroke="#DBDBDB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.333 1H7.667A6.667 6.667 0 0 0 1 7.667v6.666M47.667 1h6.666A6.667 6.667 0 0 1 61 7.667v6.666m-16.667 3.334v6.666m-26.666-6.666v6.666m3.333 20s3.333 3.334 10 3.334 10-3.334 10-3.334M31 17.667v16.666h-3.333M14.333 61H7.667A6.667 6.667 0 0 1 1 54.333v-6.666M47.667 61h6.666A6.667 6.667 0 0 0 61 54.333v-6.666"
        />
    </Svg>
)
const Memo = memo(SvgComponent)
export default Memo
