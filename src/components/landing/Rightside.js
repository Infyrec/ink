import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useGlobalVariable } from '../GlobalVariable';

export default function Rightside(){

    let { uploadProgress, setUploadProgress } = useGlobalVariable()

    return(
        <div className="column is-one-fifth full-height custom-border is-flex is-flex-direction-column px-5 is-hidden-touch">
            <div className="is-flex is-align-items-center is-justify-content-center my-3">
                <div style={{ width: 120, height: 120 }}>
                    <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} styles={buildStyles({pathColor: '#00d1b2'})}/>
                </div>
            </div>
            <div>
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
        </div>
    )
}