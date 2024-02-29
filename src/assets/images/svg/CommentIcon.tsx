import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={21}
        fill="none"
        {...props}
    >
        <Path
            fill="#686868"
            fillRule="evenodd"
            d="M10.501 0a10.43 10.43 0 0 1 7.427 3.074c4.095 4.095 4.095 10.759 0 14.854A10.535 10.535 0 0 1 10.478 21c-1.493 0-2.996-.316-4.402-.966-.414-.166-.802-.323-1.08-.323-.32.002-.751.15-1.168.294-.854.294-1.917.659-2.703-.125-.784-.784-.422-1.844-.13-2.697.143-.42.29-.854.29-1.182 0-.27-.13-.614-.33-1.11C-.873 10.94-.027 6.178 3.077 3.076A10.429 10.429 0 0 1 10.501 0Zm.001 1.466c-2.416 0-4.685.94-6.39 2.645a9.08 9.08 0 0 0-1.81 10.2c.228.566.449 1.117.449 1.69 0 .571-.197 1.147-.37 1.655-.142.418-.358 1.049-.22 1.188.136.14.771-.081 1.19-.225.504-.172 1.074-.37 1.64-.373.567 0 1.101.215 1.667.442 3.465 1.603 7.564.874 10.234-1.795 3.523-3.526 3.523-9.26 0-12.783a8.975 8.975 0 0 0-6.39-2.644Zm3.857 8.463a.977.977 0 1 1 0 1.954.98.98 0 0 1-.981-.977c0-.54.432-.977.972-.977h.009Zm-3.917 0a.977.977 0 1 1 0 1.954.98.98 0 0 1-.981-.977c0-.54.432-.977.972-.977h.009Zm-3.917 0a.977.977 0 1 1 0 1.954.98.98 0 0 1-.981-.977c0-.54.433-.977.972-.977h.009Z"
            clipRule="evenodd"
        />
    </Svg>
)
const Memo = memo(SvgComponent)
export default Memo