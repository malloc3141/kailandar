import React from "react";

const Header = () => {
    return (<div>
        <div className={"header"}>
            <div className={"header-content-wrapper"}>
                <div className={"home-link"} onClick={(e) => navigate('/mycal')}>
                    ← Back to Home
                </div>
            </div>
        </div>
    </div>);
}

export default Header;