const yphMakeForm = (input, formHandle = {}) => {
    let yphForm_ = {};
    yphForm_.input = {}
    yphForm_.handle = formHandle || {};
    Object.entries(input).map((object) => {
        const objectName = object[0];
        const objectContent = object[1];
        yphForm_.input[objectName] = {
            id: `input-${objectName}`,
            handle: {
                change: (event) => {
                    objectContent.setter(event.target.value);
                }
            },
            ...objectContent
        };
    });
    return yphForm_;
}

export default yphMakeForm;