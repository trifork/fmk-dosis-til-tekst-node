libraries{
    settings {
        profile = 'node'
    }
    maven
    docker {
        output_images = '[{"name":"dosis2text","image":"registry.fmk.netic.dk/fmk/fmk-dosistiltekst-server","user":"fmk-dosistiltekst"}]'
    }
    sonarqube_maven
}