import './landing.css'

import React from "react";

export default function Landing(){
    return(
        <section className="hero is-fullheight has-background-white">
        <div className="columns m-0">
            {/* Left side */}
            <div className="column is-one-fifth full-height custom-border is-flex is-flex-direction-column is-hidden-touch">
                <div className="is-flex is-justify-content-center my-4">
                    <figure className="image is-128x128">
                        <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
                    </figure>
                </div>
                <div className="is-flex-grow-1 my-4">
                    <aside className="menu">
                        <ul className="menu-list">
                            <li>
                                <a className="custom-font is-active">
                                    <span className="icon">
                                        <i className="fas fa-cloud"></i>
                                    </span>
                                    My Cloud
                                </a>
                            </li>
                            <li>
                                <a className="custom-font">
                                    <span className="icon">
                                        <i className="fas fa-share-from-square"></i>
                                    </span>
                                    Shared
                                </a>
                            </li>
                            <li>
                                <a className="custom-font">
                                    <span className="icon">
                                        <i className="fas fa-upload"></i>
                                    </span>
                                    Upload
                                </a>
                            </li>
                            <li>
                                <a className="custom-font">
                                    <span className="icon">
                                        <i className="fas fa-message"></i>
                                    </span>
                                    Chat
                                </a>
                            </li>
                        </ul>
                    </aside>
                </div>
                <div>
                    <aside className="menu">
                        <ul className="menu-list">
                            <li>
                                <a className="custom-font">
                                    <span className="icon">
                                        <i className="fas fa-gear"></i>
                                    </span>
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a className="custom-font">
                                    <span className="icon">
                                        <i className="fas fa-right-from-bracket"></i>
                                    </span>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </aside>
                    <div className="my-3 mx-4">
                        <p className="custom-font is-size-7">15 GB of 100 GB Used</p>
                        <progress className="progress is-primary" value="15" max="100">15%</progress>
                    </div>
                </div>
            </div>
            {/* Center */}
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
            {/* Right side */}
            <div className="column is-one-fifth full-height custom-border is-flex is-flex-direction-column is-justify-content-space-around px-5 is-hidden-touch">
                <p className="custom-font is-size-4 has-text-weight-bold my-3">Categories</p>
                {/* Cards */}
                <div className="card has-background-primary">
                    <div className="card-content">
                        <div className="content is-flex is-flex-direction-column">
                        <span className="icon">
                            <i className="fas fa-image has-text-white is-size-4"></i>
                        </span>
                        <span className="custom-font has-text-weight-bold is-size-6 has-text-white mt-1">Pictures</span>
                        <span className="custom-font is-size-7 has-text-white">100 files</span>
                        </div>
                    </div>
                </div>
                <div className="card has-background-link">
                    <div className="card-content">
                        <div className="content is-flex is-flex-direction-column">
                        <span className="icon">
                            <i className="fas fa-file has-text-white is-size-4"></i>
                        </span>
                        <span className="custom-font has-text-weight-bold is-size-6 has-text-white mt-1">Documents</span>
                        <span className="custom-font is-size-7 has-text-white">100 files</span>
                        </div>
                    </div>
                </div>
                <div className="card has-background-danger">
                    <div className="card-content">
                        <div className="content is-flex is-flex-direction-column">
                        <span className="icon">
                            <i className="fas fa-video has-text-white is-size-4"></i>
                        </span>
                        <span className="custom-font has-text-weight-bold is-size-6 has-text-white mt-1">Videos</span>
                        <span className="custom-font is-size-7 has-text-white">100 files</span>
                        </div>
                    </div>
                </div>
                <div className="card has-background-success">
                    <div className="card-content">
                        <div className="content is-flex is-flex-direction-column">
                        <span className="icon">
                            <i className="fas fa-headphones has-text-white is-size-4"></i>
                        </span>
                        <span className="custom-font has-text-weight-bold is-size-6 has-text-white mt-1">Audio</span>
                        <span className="custom-font is-size-7 has-text-white">100 files</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}