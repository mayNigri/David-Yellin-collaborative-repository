import { classes, hugim, maslulim } from "../constants/lesson-constants";

const FiltersModal = ({
    onDismiss
}) => {
    return (
        <div className="absolute z-10 flex items-center justify-center w-full h-full top-0 bg-black/70">
            <div className="rounded-md border border-black p-5 bg-white shadow-md">
                <h2>סנן לפי:</h2>
                <div className="filters">
                    <div>
                        <h3>חוג</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {
                                hugim.map((item) => {
                                    return (
                                        <div className="space-x-1 space-x-reverse">
                                            <input type="checkbox" />
                                            <label>{item}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <h3>מסלול</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {
                                maslulim.map((item) => {
                                    return (
                                        <div className="space-x-1 space-x-reverse">
                                            <input type="checkbox" />
                                            <label>{item}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <h3>כיתה</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {
                                classes.map((item) => {
                                    return (
                                        <div className="space-x-1 space-x-reverse">
                                            <input type="checkbox" />
                                            <label>{item}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <button onClick={() => onDismiss()} className="bg-black p-2 text-white rounded-md w-full">סינון</button>

                </div>

            </div>
        </div>
    );
}

export default FiltersModal;