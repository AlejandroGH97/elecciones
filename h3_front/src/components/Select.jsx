import React from 'react'
import Select from '@mui/material/Select'
import { InputLabel, MenuItem, FormControl } from '@mui/material'

export class SelectComponent extends React.Component {
    constructor (props) {
        super (props)

        this.state = {
            value: this.props.initial,
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        this.setState ({
            value: e.target.value
        })

        this.props.handleChange (e.target.value)
    }

    render () {
        let dis = this.props.items.length === 0 ? true : false
        return (
            <>
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id={this.props.label + '-label'}>{this.props.label}</InputLabel>
                    <Select 
                        labelId={this.props.label + '-label'}
                        defaultValue={this.props.initial}
                        value={this.state.value}
                        label={this.props.label}
                        onChange={this.handleChange}
                        disabled={dis}
                    >
                        {
                            this.props.items.map ((e, idx) => {
                                return <MenuItem key={idx} value={e}>{e}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </>
        )
    }
}