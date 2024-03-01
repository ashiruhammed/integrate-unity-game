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
            fill="#E01414"
            fillRule="evenodd"
            d="M1.28 4.482A3.201 3.201 0 0 1 4.482 1.28h12.036a3.201 3.201 0 0 1 3.201 3.202V8.57l-.652-.653c-.7-.7-1.836-.7-2.536 0L11.12 13.33c-.2.2-.525.2-.725 0l-1.443-1.444c-.7-.7-1.836-.7-2.536 0l-5.1 5.101a3.226 3.226 0 0 1-.034-.469V4.482Zm.538 13.813a3.199 3.199 0 0 0 2.664 1.424h12.036a3.201 3.201 0 0 0 3.201-3.2V10.38l-1.558-1.558c-.2-.2-.524-.2-.724 0l-5.413 5.412c-.7.7-1.835.7-2.535 0l-1.444-1.443c-.2-.2-.524-.2-.724 0l-5.503 5.503ZM4.482 0A4.482 4.482 0 0 0 0 4.482v12.036A4.482 4.482 0 0 0 4.482 21h12.036A4.482 4.482 0 0 0 21 16.518V4.482A4.482 4.482 0 0 0 16.518 0H4.482Zm2.817 5.378a.896.896 0 1 0 0 1.793.896.896 0 0 0 0-1.793Zm-2.177.896a2.177 2.177 0 1 1 4.353 0 2.177 2.177 0 0 1-4.353 0Z"
            clipRule="evenodd"
        />
    </Svg>
)
const Memo = memo(SvgComponent)
export default Memo
