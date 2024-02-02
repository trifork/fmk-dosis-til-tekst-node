libraries{
    node
    docker {
        image_name = 'registry.fmk.netic.dk/fmk/fmk-dosistiltekst-server'
        image_user = 'fmk-dosistiltekst'
        java_version = 11
    }
    sonarqube_node
}