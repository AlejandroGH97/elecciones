import React from 'react'
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from 'recharts'
import { CircularProgress } from '@mui/material'

export class BarChartComponent extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        return this.props.data.length === 0 ? (
            <>
                <CircularProgress />
            </>
        ) : (
                <BarChart width={800} height={250} data={this.props.data} style={{margin: 'auto'}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={this.props.name} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Votos Válidos" dataKey={this.props.value1} fill="#158FAD" />
                    <Bar name="Votos Inválidos" dataKey={this.props.value2} fill="#AFB83B" />
                </BarChart>
        )
    }
}