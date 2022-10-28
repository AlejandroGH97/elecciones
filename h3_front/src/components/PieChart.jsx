import React from 'react'
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts'
import { CircularProgress } from '@mui/material'

const colors = [
    '#158FAD',
    '#AFB83B'
]

export class PieChartComponent extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        console.log (this.props)
        return this.props.data.length === 0 ? (
            <>
                <CircularProgress />
            </>
        ) : (
            <>
            <PieChart width={800} height={250} style={{margin: 'auto'}}>
                <Pie 
                    data={this.props.data} 
                    dataKey={this.props.value} 
                    nameKey={this.props.name} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={50}
                    label
                >
                    {
                        this.props.data.map((e, idx) => (
                            <Cell key={idx} fill={colors[idx]} />
                        ))
                    }
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>
            </>
        )
    }
}