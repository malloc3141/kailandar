import React, {useEffect, useState} from "react";
import axios from "axios";

function DpDropDown(props) {
    const [dropDownItems, setDropDownItems] = useState([]);

    useEffect(() => {
        axios
            .get("https://api.malloc.newbie.sparcsandbox.com/dp-names")
            .then((response) => {
                setDropDownItems(response.data);
            })
            .catch((err) => {
                console.error("Error fetching from DB", err);
                setDropDownItems([]);
            });
    }, []);

    const handleSelect = (e) => {
        props.setDepartment(e.target.value);
    };

    return (
            <select onChange={handleSelect}>
                <option disabled hidden selected>{props.placeholder} 선택</option>
                {dropDownItems.map((item, index) => (
                    <option key={index} value={item.name}>
                        {item.name}
                    </option>
                ))}
            </select>
    );
}

export default DpDropDown;