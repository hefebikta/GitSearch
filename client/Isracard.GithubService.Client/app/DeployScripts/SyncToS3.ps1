$ConfigData.AllNodes |foreach {
     $h=$_
    if( $h.Get_Item("NodeName") -eq $env:COMPUTERNAME){
    $dynamicVariables=$h.Get_Item("dynamicVariables")
    }          
 }


#tokenize files:
        $path = $applicationPath + "\*"
        $allFiles = Get-ChildItem $path -include *.config -Recurse
        foreach($filePath in $allFiles){
                $file=(Get-Content $filePath) 
                foreach($instance in  $dynamicVariables.GetEnumerator()){Foreach-Object {
                      $stringReplace="__"+$instance.Name+"__"
                      $file= $file -replace $stringReplace, $instance.Value
                      }
                } 
                Set-Content $filePath $file
        }

#sync to S3:
        $TargetDeploymentBucket="s3://$bucket$Environment/web-sites/profile/"

		Write-Verbose -Verbose $TargetDeploymentBucket
        aws s3 cp $applicationPath $TargetDeploymentBucket  --acl public-read   --recursive  --exclude "DeployScripts/*"  --cache-control "public, max-age=30672000"
        aws s3 cp $applicationPath/index.html $TargetDeploymentBucket  --acl public-read   --cache-control "no-cache"
