export default function ModelSizes ({ model, className }) {
    let measurements = [
        {
            label: 'Shoe',
            key: 'shoe',
            sign: 'UK'
        },
        {
            label: 'Waist',
            key: 'waist',
            sign: '″',
            type: 'inch',
        },

        {
            label: 'Chest',
            key: 'chest',
            sign: '″',
            type: 'inch',
        },

        {
            label: 'Hips',
            key: 'hips',
            sign: '″',
            type: 'inch',
        },
    ];
    let heightText = '';
    let heightCM = 0;
    if(model.heightFeet){
        heightCM = model.heightFeet * 30.48;
        if(model.heightInches){
            heightCM += model.heightInches * 2.54;
        }
        if(heightCM){
            heightText = `Height: ${model.heightFeet}'${model.heightInches?(model.heightInches+'″'):''} / ${Math.floor(heightCM)}cm`
        }

    }

    {model.heightFeet && `Height: ${model.heightFeet}'${model.heightInches || ''}`}
    return <div className={className + ' clearfix text-xs'}>
        <div
            className="float-left w-6/12">{heightText}</div>
        {measurements.map((measurement, key) => {
            let val = model[measurement.key]
            if (!val) {
                return null
            }

            let text = `${measurement.label}: ${val}${measurement.sign}`
            if (measurement.type === 'inch') {
                text += ` / ${Math.ceil(val * 2.54)}cm`
            }
            return <div className="float-left w-6/12" key={key}>
                {text}
            </div>

        })}
    </div>
}
