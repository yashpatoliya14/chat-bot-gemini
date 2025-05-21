import { useState, CSSProperties } from "react";
import { CircleLoader } from "react-spinners";
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
export default function Loader() {

    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("black");
    return (
        <>
            <div className="sweet-loading">
                <CircleLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </>
    )
}