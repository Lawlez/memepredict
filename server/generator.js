const fs = require('fs')

const getExports = (componentsDir, indexFiles) => {

    let pathWithExports = {}

    /** folgende regex hat folgendes Ziel:

     * finde ALLE 'exports' in einem File

     * matche diese nach 'default' or 'nondefault' exports

     * matche auch components mit HoC oder compose() funktionen

     */

    const regex = /export\s(const|default)\s(\w+\((\w+)\)$|\w+\([\s\S]*?(?<=\))\((\w+)|\w+)/gim

    /**

     * export\s(const|default)   => sucht nach den wort 'export gefolgt von whitespace+ const/default

     * (\w+\((\w+)\)$    => sucht nach patterns wie: compose(component) EOL

     * \w+\([\s\S]*?(?<=\))\((\w+)   => sucht nach multiline exports wie z.b. im PasswordInput

     * \w+ => standard export case > 'export const component'

     */

    indexFiles.forEach(filePath => {

        let contents = fs.readFileSync(filePath).toString('utf-8')

        pathWithExports[filePath] = {

            defaultExports: [],

            nonDefaultExports: []

        }

        while ((m = regex.exec(contents)) !== null) {

            // This is necessary to avoid infinite loops with zero-width matches

            if (m.index === regex.lastIndex) {

                regex.lastIndex++

            }

 

            let newM = m.filter(elem => elem)

            console.table(newM)

 

            if (newM[1] === 'default') {

                pathWithExports[filePath].defaultExports.push(

                    newM[newM.length - 1]

               )

            } else {

                pathWithExports[filePath].nonDefaultExports.push(

                    newM[newM.length - 1]

                )

            }

        }

    })

    return pathWithExports

}

 

const generateExportFiles = (componentExports, filesToGenerate) => {

    let contents = []

    let regexSolution

    componentExports.forEach(Export => {

        let currentContent

        console.log(Export)

        console.log(Export[1].defaultExports[0])

        currentContent = `export { default as ${Export[1].defaultExports[0]} } from ${Export[0]}`

        contents.push(currentContent)

        Export[1].nonDefaultExports.forEach(nDExport => {

            nonDefaultContent = `export ${nDExport} from ${Export[0]}`

            contents.push(nonDefaultContent)

        })

    })

    console.log(contents)

    //fs.writeFileSync(filesToGenerate[0], '//testing')

}

 

const autoExportGenerator = () => {

    const componentsDir = './presentational/MUI'

    let rootLevelFolders = []

    fs.readdirSync(componentsDir).forEach(file => {

        if (!file.includes('.')) {

            rootLevelFolders.push(file)

        }

    })

 

    let files = []

    rootLevelFolders.forEach(subFolder => {

        fs.readdirSync(`${componentsDir}/${subFolder}`).forEach(file => {

            if (!file.includes('.')) {

                fs.readdirSync(`${componentsDir}/${subFolder}/${file}`).forEach(

                    dir => {

                        if (dir.includes('.')) {

                            files.push(

                                `${componentsDir}/${subFolder}/${file}/${dir}`

                            )

                        }

                    }

                )

            } else {

                files.push(`${componentsDir}/${subFolder}/${file}`)

            }

        })

    })

    let indexFiles = []

    files.forEach(file => {

        if (file.includes('index.js')) {

            indexFiles.push(file)

        }

    })

 

    let pathWithExports = getExports(componentsDir, indexFiles)

    console.table(pathWithExports)

    let filesToGenerate = []

    let componentsExports = []

    for (const path in pathWithExports) {

        if (

            (pathWithExports[path].defaultExports &&

                pathWithExports[path].defaultExports.length) ||

            (pathWithExports[path].nonDefaultExports &&

                pathWithExports[path].nonDefaultExports.length)

        ) {

            componentsExports.push([path, pathWithExports[path]])

        } else {

            filesToGenerate.push(path)

        }

    }

    console.log({ filesToGenerate, componentsExports })

    generateExportFiles(componentsExports, filesToGenerate)

}

 

autoExportGenerator()

 