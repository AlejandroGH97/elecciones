import React from 'react'
import { BarChartComponent } from '../components/BarChart'
import { PieChartComponent } from '../components/PieChart'
import { Box, Container, Stack, Paper } from '@mui/material'
import { SelectComponent } from '../components/Select'
import { getDepartamentos, getProvinciasByDepartamento, getDistritosByProvinciaDepartamento } from '../db/ubigeo'
import { getDataFromDepartamento, getDataFromDistritoProvinciaDepartamento, getDataFromProvinciaDepartamento } from '../db/votos'


class HomePage extends React.Component {
    constructor (props) {
        super (props)

        this.state = {
            departamento: "Amazonas",
            provincia: "",
            distrito: "",
            header: "Resultados Electorales en: Amazonas",
            itemsDep: [],
            itemsProv: [],
            itemsDist: [],
            barData: [],
            pieData: []
        }

        this.onChangeDepartamento = this.onChangeDepartamento.bind (this)
        this.onChangeProvincia = this.onChangeProvincia.bind (this)
        this.onChangeDistrito = this.onChangeDistrito.bind (this)
    }

    componentDidMount () {
        getDepartamentos ()
        .then ((res) => {
            this.setState ({
                itemsDep: res.data
            })
        })

        getProvinciasByDepartamento (this.state.departamento)
        .then ((res) => {
            this.setState ({
                itemsProv: res.data
            })
        })
        
        getDataFromDepartamento (this.state.departamento)
        .then ((res) => {
            this.updateChartsData (res.data)
        })  
    }


    updateChartsData (data) {
        let validos = 0
        let invalidos = 0
        let candidatos = []

        for (let i = 0; i < data.length; ++i) {
            validos += data[i].votos_validos
            invalidos += data[i].votos_totales - data[i].votos_validos
            candidatos.push ({
                candidato: data[i].candidato,
                votos_validos: data[i].votos_validos,
                votos_invalidos: data[i].votos_totales - data[i].votos_validos
            })
        }
        
        this.setState ({
            barData: candidatos,
            pieData: [
                {
                    name: "Votos Válidos",
                    value: validos
                },
                {
                    name: "Votos Inválidos",
                    value: invalidos
                }
            ]
        })
    }


    onChangeDepartamento (idDep) {
        this.setState ({
            departamento: idDep,
            header: `Resultados Electorales en: ${idDep}`
        })

        getProvinciasByDepartamento (idDep)
        .then ((res) => {
            this.setState ({
                itemsProv: res.data,
                provincia: "",
                itemsDist: []
            })
        })
        
        getDataFromDepartamento (this.state.departamento)
        .then ((res) => {
            this.updateChartsData (res.data)
        })

        
    }


    onChangeProvincia (idProv) {
        this.setState ({
            provincia: idProv,
            distrito: "",
            header: `Resultados Electorales en: ${this.state.departamento} > ${idProv}`
        })

        getDistritosByProvinciaDepartamento (idProv, this.state.departamento)
        .then ((res) => {
            this.setState ({
                itemsDist: res.data
            })
        })

        getDataFromProvinciaDepartamento (idProv, this.state.departamento)
        .then ((res) => {
            this.updateChartsData (res.data)
        })
        
    }


    onChangeDistrito (idDist) {
        this.setState ({
            distrito: idDist,
            header: `Resultados Electorales en: ${this.state.departamento} > ${this.state.provincia} > ${idDist}`
        })

        getDataFromDistritoProvinciaDepartamento (idDist, this.state.provincia, this.state.departamento)
        .then ((res)=> {
            this.updateChartsData (res.data)
        })
    }


    render () {
        return (
            <>
                <Container sx={{ padding: 2}}>
                    <Stack spacing={5}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                            <Paper elevation={3} sx={{padding: 3}}>
                                <Box>
                                    <Stack spacing={3} direction='row'>
                                        <SelectComponent 
                                            label="Departamento" 
                                            handleChange={this.onChangeDepartamento}
                                            initial={this.state.departamento}
                                            items={this.state.itemsDep}
                                        />
                                        <SelectComponent 
                                            label="Provincia" 
                                            handleChange={this.onChangeProvincia}
                                            initial={this.state.provincia}
                                            items={this.state.itemsProv}
                                        />
                                        <SelectComponent 
                                            label="Distrito" 
                                            handleChange={this.onChangeDistrito}
                                            initial={this.state.distrito}
                                            items={this.state.itemsDist}
                                        />
                                    </Stack>
                                </Box>
                            </Paper>
                        </Box>
                        
                        <Stack spacing={3}>
                            <h1>{this.state.header}</h1>
                            <Paper elevation={0} sx={{margin: 'auto'}}>
                                <BarChartComponent data={this.state.barData} value1="votos_validos" value2="votos_invalidos" name="candidato"/>
                            </Paper>
                        
                            <Paper elevation={0} sx={{margin: 'auto'}}>
                                <h1>Total de votos válidos</h1>
                                <PieChartComponent data={this.state.pieData} name="name" value="value"/>
                            </Paper>
                        </Stack>   
                    </Stack>
                </Container>
            </>
        )
    }
}

export default HomePage