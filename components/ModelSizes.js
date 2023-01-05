export default function ModelSizes ({ model, className }) {
    let measurements = [
        {
            label: 'Shoe',
            key: 'shoe',
            sign: ''
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
    ]
    return <div className={className + ' clearfix'}>
        <div className='float-left w-6/12'>{model.heightFeet && `Height: ${model.heightFeet}'${model.heightInches || ''}`}</div>
        {measurements.map((measurement, key) => {
            let val = model[measurement.key]
            if (!val) {
                return null
            }
            return <div className='float-left w-6/12' key={key}>
                {measurement.label}: {val}{measurement.sign}

            </div>

        })}
    </div>
}
