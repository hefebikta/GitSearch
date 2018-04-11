
If($stage -eq 'PROD')
 {
   $Environment = ""
   $Env= ''
   $EnvironmentId=''
   $Stage=''
   $EnvironmentPaireId=''
 }
else
{
 $Stage=$Stage.ToLower()
 $Environment = "/$Stage$EnvironmentId"
 $EnvironmentId = "-$EnvironmentId"
 $Stage = ".$Stage"
 $Env= "/$Environment"
 $EnvironmentPaireId="-$EnvironmentPaireId"
 
}
$ConfigData = @{ 
      AllNodes = @( 
         @{ NodeName = $env:COMPUTERNAME; 
             dynamicVariables=@{
				 "serverUrl"= "http://api$EnvironmentId$Stage.sarine.com/"
                 "ipUrl" = "https://identityprovider$EnvironmentId$Stage.sarineplatform.com"
				 "barcodeUrl"="http://barcode$EnvironmentPaireId$Stage.sarinelight.com"
				 "lightUrl"="http://app$EnvironmentPaireId$Stage.sarinelight.com/Stone/Stone/"
				 "loupeUrl"= "http://$bucket$Environment/web-sites/loupe-app/index.html#/measurement"
				 "ocUrl"= "http://ordercenter$EnvironmentId$Stage.sarineplatform.com"
             }  
          }
    )
}