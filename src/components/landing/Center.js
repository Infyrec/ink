import React from 'react';

export default function Center(){
    return(
        <div className="column full-height custom-border">
            {/* Search bar */}
            <div className="is-flex is-justify-content-space-between my-3">
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                    <input className="input" type="text" placeholder="Search" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-search"></i>
                    </span>
                    </p>
                </div>
                <div>
                    <p className="buttons">
                        <button className="button is-hidden-touch">
                            <span className="icon">
                                <i className="fa-solid fa-folder-plus"></i>
                            </span>
                        </button>
                        <button className="button is-hidden-touch">
                            <span className="icon">
                                <i className="fa-solid fa-upload"></i>
                            </span>
                        </button>
                        <button className="button">
                            <span className="icon">
                                <i className="fa-solid fa-bars"></i>
                            </span>
                        </button>
                    </p>
                </div>
            </div>
            {/* All files */}
            <div className="my-3">
                <p className="custom-font is-size-5 has-text-weight-bold my-3">Files</p>
                {/* List view */}
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Share</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span className="icon"><i className="fas fa-image" aria-hidden="true"></i></span>
                                <span className="custom-font is-size-6">Ragul</span>
                            </td>
                            <td className="custom-font">PNG file</td>
                            <td className="custom-font">5 MB</td>
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
                                <span className="custom-font is-size-6">Ragul</span>
                            </td>
                            <td className="custom-font">PNG file</td>
                            <td className="custom-font">5 MB</td>
                            <td>
                                <a><span className="icon"><i className="fas fa-share-nodes" aria-hidden="true"></i></span></a>
                            </td>
                            <td>
                                <a><span className="icon"><i className="fas fa-ellipsis" aria-hidden="true"></i></span></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}