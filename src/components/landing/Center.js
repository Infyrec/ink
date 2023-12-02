export default function Center(){
    return(
        <div className="column full-height custom-border">
            {/* Search bar */}
            <div className="is-flex-touch my-3">
                {/* Menu icon */}
                <button className="button mr-5 is-hidden-desktop">
                    <span className="icon is-small">
                    <i className="fas fa-bars"></i>
                    </span>
                </button>
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                    <input className="input" type="text" placeholder="Search" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-search"></i>
                    </span>
                    </p>
                </div>
            </div>
            {/* All files */}
            <div className="my-3">
                <p className="custom-font is-size-4 has-text-weight-bold my-3">All Files</p>
                {/* List view */}
                <table className="table is-striped is-fullwidth">
                    <tr>
                        <td>
                            <span className="icon"><i className="fas fa-image" aria-hidden="true"></i></span>
                            <span className="custom-font">Ragul</span>
                        </td>
                        <td>PNG file</td>
                        <td>5 MB</td>
                        <td>
                            <a><span className="icon"><i className="fas fa-share-nodes" aria-hidden="true"></i></span></a>
                        </td>
                        <td>
                            <a><span className="icon"><i className="fas fa-ellipsis" aria-hidden="true"></i></span></a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="icon"><i className="fas fa-image" aria-hidden="true"></i></span>
                            <span className="custom-font">Ragul</span>
                        </td>
                        <td>PNG file</td>
                        <td>5 MB</td>
                        <td>
                            <a><span className="icon"><i className="fas fa-share-nodes" aria-hidden="true"></i></span></a>
                        </td>
                        <td>
                            <a><span className="icon"><i className="fas fa-ellipsis" aria-hidden="true"></i></span></a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}