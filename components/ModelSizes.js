export default function ModelSizes ({ model, className }) {

    let measurements = [

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
        {
            label: 'Shoe',
            key: 'shoe',
            sign: ' UK'
        },
    ]
    let heightText = ''
    let heightCM = 0

    if (model.heightFeet) {
        heightCM = model.heightFeet * 30.48
        if (model.heightInches) {
            heightCM += model.heightInches * 2.54
        }
        if (heightCM) {
            heightText = `Height: ${model.heightFeet}'${model.heightInches ? (model.heightInches + '″') : ''} / ${Math.floor(heightCM)}cm`
        }

    }

    {model.heightFeet && `Height: ${model.heightFeet}'${model.heightInches || ''}`}
    return <div className={className + ' clearfix'}>
        <div>{model.city.name}</div>
        <div
            className="">{heightText}</div>

        {measurements.map((measurement, key) => {
            let val = model[measurement.key]
            if (!val) {
                return null
            }

            let text = `${measurement.label}: ${val}${measurement.sign}`
            if (measurement.type === 'inch') {
                text += ` / ${Math.ceil(val * 2.54)}cm`
            }
            return <div className="" key={key}>
                {text}
            </div>

        })}

    </div>
}
