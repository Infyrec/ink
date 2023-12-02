export default function Rightside(){
    return(
        <div className="column is-one-fifth full-height custom-border is-flex is-flex-direction-column px-5 is-hidden-touch">
            <p className="custom-font has-text-weight-bold my-3">
                <span className="icon">
                    <i className="fa-solid fa-filter"></i>
                </span>
                Filter
            </p>
            <p className="buttons is-flex is-justify-content-space-around">
                <button className="button">
                    <span className="icon">
                        <i className="fa-solid fa-image"></i>
                    </span>
                </button>
                <button className="button">
                    <span className="icon">
                        <i className="fa-solid fa-file"></i>
                    </span>
                </button>
                <button className="button">
                <span className="icon">
                    <i className="fa-solid fa-video"></i>
                </span>
                </button>
                <button className="button">
                    <span className="icon">
                        <i className="fa-solid fa-headphones"></i>
                    </span>
                </button>
            </p>
        </div>
    )
}