libraries{
    settings {
        profile = 'node'
    }
    maven
    docker {
        output_images = '[{"name":"fmk-dosistiltekst","image":"registry.fmk.netic.dk/fmk/fmk-dosistiltekst-server","user":"fmk-dosistiltekst"}]'
    }
    sonarqube_maven
}