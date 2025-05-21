import { CSSProperties } from "react";
import { CircleLoader } from "react-spinners";
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
export default function Loader() {

    return (
        <>
            <div className="sweet-loading">
                <CircleLoader
                    color={"black"}
                    loading={true}
                    cssOverride={override}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </>
    )
}