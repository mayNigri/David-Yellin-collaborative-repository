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
                        {
                            ['שילוב אומנויות', 'חינוך כיתה'].map((hug) => {
                                return (
                                    <div className="space-x-1 space-x-reverse">
                                        <input type="checkbox" />
                                        <label>{hug}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <h3>מסלול</h3>
                        {
                            ['גיל הרך', 'גיל הרך חינוך מיוחד'].map((hug) => {
                                return (
                                    <div className="space-x-1 space-x-reverse">
                                        <input type="checkbox" />
                                        <label>{hug}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <h3>כיתה</h3>
                        {
                            ['גן', 'כיתה א׳'].map((hug) => {
                                return (
                                    <div className="space-x-1 space-x-reverse">
                                        <input type="checkbox" />
                                        <label>{hug}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button onClick={() => onDismiss()} className="bg-black p-2 text-white rounded-md w-full">סינון</button>

                </div>

            </div>
        </div>
    );
}

export default FiltersModal;