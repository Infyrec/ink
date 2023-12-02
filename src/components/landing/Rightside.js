export default function Rightside(){
    return(
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
    )
}