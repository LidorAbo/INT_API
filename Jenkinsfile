@Library('Utilities') _
def BuildVersion
<<<<<<< HEAD
 pipeline {
   options {
      timeout(time: 30, unit: 'MINUTES')

   }
  environment {
    registry = "dockerhubuser/repo"
    registryCredential = 'dockerhub'
    dockerImage = ''
  }
    agent {
        label 'master'
    }
    stages {
        stage ('Checkout') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: git_cred_id, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        dir(release_dir) {
                            deleteDir()
                            checkout([$class: 'GitSCM', branches: [[name: dev_branch]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: git_cred_id, url: "$scm_url/$GIT_USERNAME/$release_repo"]]])

                        }
                        dir(expiremnt_dir) {
                            deleteDir()
                            checkout([$class: 'GitSCM', branches: [[name: dev_branch]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: git_cred_id, url: "$scm_url/$GIT_USERNAME/$experiment_repo"]]])
                            result = sh(script: 'git branch -r | grep -q 1.*', returnStatus: true)
                            if (!result)
                                Current_version = sh(script: "git branch -r | sed 's/[^0-9\\.]*//g' | sort -r | head -n 1", returnStdout: true).trim()
                            else
                                Current_version = initial_version
                            Commit_Id = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                            Build_version = Current_version + underscore + Commit_Id
                            println("Checking the build version: $Build_version")
                            last_digit_current_version = sh(script: "echo $Current_version | cut -d$dot -f3", returnStdout: true).trim()
                            NextVersion = sh(script: "echo $Current_version | cut -d$dot -f1", returnStdout: true).trim() + dot + sh(script: "echo $Current_version |cut -d$dot -f2", returnStdout: true).trim() + dot + (Integer.parseInt(last_digit_current_version) + 1)


                        }
                    }
                }
            }
        }
        stage ('Unit Test') {
            steps {
                script {
                    sh "echo Checking the build version: $Build_version"
                    dir("./$folder_scripts") {
                        try {
                            sh "$module $test_script_name"
                        }
                        catch (exception) {
                            println "The test is failed"
                            currentBuild.result = pipeline_failure_indicator_string
                            throw exception
                        }
                    }

                }
            }
        }

           stage ('build') {
               steps {
                   script {
                       archive_name = 'archive'
                       sh "echo $workspace"
                       dir(workspace) {
                           stash includes: "$docker_file_name,**/$folder_scripts/*", name: archive_name
                       }
                       node(docker_slave_node) {
                           try {
                               unstash archive_name
                               sh "docker build --build-arg script_name=$script_name --build-arg test_script_name=$test_script_name --build-arg folder_scripts=$folder_scripts --build-arg module=$module --build-arg image_name=$base_image_name . -t $image_name:$Build_version>/dev/null"
                           }
                           catch (exception) {
                               println "The image build is failed"
                               currentBuild.result = pipeline_failure_indicator_string
                               throw exception
                           }

                       }
                   }
               }
        }

                  stage ('sanity_test') {
                      steps {
                          script {
                              remove_image_command = 'docker rmi -f $(sudo docker images | grep python | awk \'{print $3}\')'
                              error_message_running_container = "The result of running container is incorrect"
                              node(docker_slave_node) {
                                  try {
                                      result = sh(script: "docker run --rm --name $image_name $image_name:$Build_version", returnStdout: true).trim()
                                      if (result != string_to_check) {
                                          sh label: '', script: remove_image_command
                                          currentBuild.result = pipeline_failure_indicator_string
                                          throw new Exception(error_message_running_container)
                                      }
                                  }
                                  catch (exception) {
                                      sh label: '', script: remove_image_command
                                      currentBuild.result = pipeline_failure_indicator_string
                                      throw new Exception(error_message_running_container)
                                  }
                              }
                          }
                      }
        }
        
    }
}
=======
def Current_version
def NextVersion
def mongo_image_to_check
 pipeline {

     options {
         timeout(time: 30, unit: 'MINUTES')
     }
     agent { label 'slave' }
     stages {
         stage('Checkout') {
             steps {
                 script {
                     node('master') {
                         dir(release_dir) {
                             deleteDir()
                             checkout([$class: 'GitSCM', branches: [[name: prod]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: git_cred_id, url: release_repo]]])
                             path_json_file = sh(script: "pwd", returnStdout: true).trim() + path_seperator + prod + suffix_json
                             Current_version = Return_Json_From_File(path_json_file).Services.INT_API
                         }
                     }

                     dir(global_vars.int_api_folder) {
                         deleteDir()
                         checkout([$class: 'GitSCM', branches: [[name: dev]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: git_cred_id, url: int_api_rep]]])
                         Commit_Id = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                         BuildVersion = Current_version + underscore + Commit_Id
                         println("Checking the build version: $BuildVersion")

                     }
                     dir(dev) {
                         deleteDir()
                         checkout([$class: 'GitSCM', branches: [[name: dev]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: git_cred_id, url: release_repo]]])
                         last_digit_current_version = Return_last_digit_current_version(Current_version)
                         NextVersion = Return_Next_Version(Current_version, last_digit_current_version)

                     }
                     dir(global_vars.db_api_folder) {
                         deleteDir()
                         checkout([$class: 'GitSCM', branches: [[name: dev]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: git_cred_id, url: int_db_rep]]])


                     }
                 }
             }
         }
         stage('UT') {
             steps {
                 println('Will be added soon ')

             }
         }
         stage('Build') {
             steps {
                 script {
                     dir(global_vars.db_api_folder) {
                         try {

                             mongo_image_to_check = docker.build("$mongodb_module:$BuildVersion")

                         }
                         catch (exception) {
                             println "The image build is failed"
                             currentBuild.result = pipeline_failure_indicator_string
                             throw exception
                         }

                     }


                 }


             }
         }

     }
 }
//
//        stage ('Unit Test') {
//            steps {
//                script {
//                    sh "echo Checking the build version: $Build_version"
//                    dir("./$folder_scripts") {
//                        try {
//                            sh "$module $test_script_name"
//                        }
//                        catch (exception) {
//                            println "The test is failed"
//                            currentBuild.result = pipeline_failure_indicator_string
//                            throw exception
//                        }
//                    }
//
//                }
//            }
//        }
//
//           stage ('build') {
//               steps {
//                   script {
//                       archive_name = 'archive'
//                       sh "echo $workspace"
//                       dir(workspace) {
//                           stash includes: "$docker_file_name,**/$folder_scripts/*", name: archive_name
//                       }
//                       node(docker_slave_node) {
//                           try {
//                               unstash archive_name
//                               sh "docker build --build-arg script_name=$script_name --build-arg test_script_name=$test_script_name --build-arg folder_scripts=$folder_scripts --build-arg module=$module --build-arg image_name=$base_image_name . -t $image_name:$Build_version>/dev/null"
//                           }
//                           catch (exception) {
//                               println "The image build is failed"
//                               currentBuild.result = pipeline_failure_indicator_string
//                               throw exception
//                           }
//
//                       }
//                   }
//               }
//        }
//
//                  stage ('sanity_test') {
//                      steps {
//                          script {
//                              remove_image_command = 'docker rmi -f $(sudo docker images | grep python | awk \'{print $3}\')'
//                              error_message_running_container = "The result of running container is incorrect"
//                              node(docker_slave_node) {
//                                  try {
//                                      result = sh(script: "docker run --rm --name $image_name $image_name:$Build_version", returnStdout: true).trim()
//                                      if (result != string_to_check) {
//                                          sh label: '', script: remove_image_command
//                                          currentBuild.result = pipeline_failure_indicator_string
//                                          throw new Exception(error_message_running_container)
//                                      }
//                                  }
//                                  catch (exception) {
//                                      sh label: '', script: remove_image_command
//                                      currentBuild.result = pipeline_failure_indicator_string
//                                      throw new Exception(error_message_running_container)
//                                  }
//                              }
//                          }
//                      }
//        }
//
//    }

>>>>>>> bd221c00e6d38b309fe99eed111fd74748a6bcd0
