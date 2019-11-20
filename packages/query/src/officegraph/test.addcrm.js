var func = require("./index")

var insiders = [
    "brfentr@caresource.com:BJ::Insider",
    "Wolfs@nlcom.nl:Cyrille::Insider",
    "jana.babackova@ilikesharepoint.cz:Jana::Insider",
    "maximiliano.machado@softwareone.com:Maximiliano::Insider",
    "peter.heffner@thermofisher.com:Peter::Insider",
    "peter@malling01.onmicrosoft.com:Peter Malling::Insider",
    "jhopkins1@fmi.com:Jeff Hopkins::Insider",
    "tg@thilograf.com:THilo::Insider",
    "Marcel@365forall.com:Marcel::Insider",
    "Pgafanha@trustit.pt:Paulo::Insider",
    "jrollins@madwolf.com:Joel::Insider",
    "cpendzich@vulcangms.com:Chase::Insider",
    "jason.miller@csiweb.com:Jason::Insider",
    "ssumner@businesscloudintegration.co.uk:Sharon::Insider",
    "Pwessell@therfield.surrey.sch.uk:Phil Wessell::Insider",
    "Terry@terrylynch.net:Terry::Insider",
    "philip.worrell@theglobalfund.org:Phil::Insider",
    "matt@schumatt.com:Matt::Insider",
    "michael@lamontagnesolutions.com:Michael::Insider",
    "K.schneider@ipi-gmbh.com:Karl Gerd::Insider",
    "Romain.dalle@sword-group.com:Romain::Insider",
    "martin.berg@lime.tech:Martin::Insider",
    "Msn-fischer@hotmail.de:Andreas::Insider",
    "Ivor.Davies@ivordaviesitconsulting.onmicrosoft.com:Ivor::Insider",
    "Zoe.wilson@agilisys.co.uk:Zoe::Insider",
    "Mitchell.hocknell@qut.edu.au:Mitch::Insider",
    "joao@bindtuning.com:Joao::Insider",
    "adam.simpson@hmrc.gov.uk:Adam Simpson::Insider",
    "apong@dstcontrols.com:Andrew::Insider",
    "a@awp.io:Andrew::Insider",
    "slane@ithaca.edu:Steve::Insider",
    "Christopher.meredith@ampf.com:Chris::Insider",
    "wm@redaktion-miedl.de:Wolfgang::Insider",
    "email@nuno-silva.net:Nuno Árias Silva::Insider",
    "paul@kbworks.nl:paul::Insider",
    "barbora.mazochova@digiskills.cz:Barbora:Mazochova:Insider",
    "jorge.castaneda@outlook.com:Jorge:Castañeda:Insider",
    "michel.laplane@hotmail.com:Michel:LaPlane:Insider",
    "taiki.yoshida@outlook.com:Taiki:Yoshida:Insider",
    "hjalmur@thekking.is:Hjálmur:Hjálmsson:Insider",
    "dbaranyi@solutinno.net:Dániel:Baranyi:Insider",
    "juped@nets.eu:Jasper:Pedersen:Insider",
    "aiols@nets.eu:Arne:Olsen:Insider",
    "alongoldberg@gmail.com:Alon:Goldberg:Insider",
    "katja.jokisalo@sulava.com:Katja:Jokisalo:Insider",
    "anette.lonnberg@ninetech.com:Anette:Lönnberg:Insider",
    "Jbrandon@sharepointsoapbox.onmicrosoft.com:Fred::Insider",
    "knut.relbe-moe@meteoriitti.com:Knut Relbe-Moe::Insider",
    "jpvandenbogert@portiva.nl:Jean-Paul::Insider",
    "Mjablonski@wilsonlanguage.com:Matt::Insider",
    "Jm014558@cerner.net:John::Insider",
    "Ben.scott@uk.nestle.com:Ben::Insider",
    "smachin@motus.com:Scott::Insider",
    "gary@grassrootsit.com.au:Gary::Insider",
    "shie.benaderet@northwestschool.org:Shie::Insider",
    "Frank@mcrtrust.com:Frank::Insider",
    "elise.passiniemi@op.fi:Elise::Insider",
    "michelle@miktysh.com.au:Michelle::Insider",
    "m.hanisch@das-ee.com:Markus::Insider",
    "lucia.justo@molycop.pe:Lucia::Insider",
    "Brent.solem@target.com:Brent::Insider",
    "Reinettew@provoke.co.nz:Reinette::Insider",
    "cecilie.widsteen@tine.no:Cecilie::Insider",
    "skills@kolis.hu:David::Insider",
    "michael.deschler@wagner.ch:Michael::Insider",
    "Ian.mayor@rhipe.com:Ian::Insider",
    "Adam.deltinger@stratiteq.com:Adam::Insider",
    "sumeet.gandhi@am.jll.com:Sumeet Gandhi::Insider",
    "Daniel.parlfjard@teliacompany.com:Daniel::Insider",
    "Katarina.gullstrand@infozone.se:Katarina::Insider",
    "mail@angela-schnellert.de:Angela::Insider",
    "Samit.saini@heathrow.com:Samit::Insider",
    "jhody@itron.com:Jerome::Insider",
    "hadrien.nessim.socard@fr.clara.net:Hadrien-Nessim::Insider",
    "oleg.pavlov@skysoft-is.co.uk:Oleg::Insider",
    "Cboivin70@gmail.com:Chris::Insider",
    "Blipscomb@mcpss.com:Byron::Insider",
    "david.stevens@hexagonragasco.com:David::Insider",
    "daniel@condor.com.ni:Daniel::Insider",
    "acrawford@msedu.co.uk:Alan::Insider",
    "ian.cockburn@lr.org:Ian::Insider",
    "jonas.bjorkander@sweco.se:Jonas::Insider",
    "Hal@techassistgroup.net:Hal::Insider",
    "rob@carrobes.co.uk:Rob::Insider",
    "Jnitchal@amgen.com:Joe::Insider",
    "Email@secretaryzone.com:Jennifer::Insider",
    "Janusz.ruess@sws.de:Janusz::Insider",
    "mburton@hbs.edu:Melissa::Insider",
    "Jeremy.miller@kctcs.edu:Jeremy::Insider",
    "richard.toland@perpetualreality.com:Richard::Insider",
    "michel.laplane@sharevisual.onmicrosoft.com:Michel::Insider",
    "g.brown@gns.cri.nz:Glyn::Insider",
    "brett@wrl.org:Brett::Insider",
    "Wayne_Shirt@hotmail.com:Wayne Shirt::Insider",
    "jente.vandijck@vanroey.be:Jente::Insider",
    "Mfshrimpton@dundee.ac.uk:Mary::Insider",
    "david.taig@empired.com:David::Insider",
    "craig.white@kcl.ac.uk:Craig White::Insider",
    "Jami.shircel@kohler.com:Jami::Insider",
    "025738@nttdata.com:Bala::Insider",
    "Bernd.Diel@dm.de:Bernd Diel::Insider",
    "logan.kivo@uticanational.com:Logan::Insider",
    "zachf@elf.uk.com:Zach::Insider",
    "debi.fluckiger@zaact.com:Debi::Insider",
    "sgrant@hbs.edu:Sara::Insider",
    "campb847@msu.edu:Chris::Insider",
    "brodiek@trigard.com:Brodie::Insider",
    "tsr@tyrens.se:Tomas::Insider",
    "v.georges@daher.com:vincent::Insider",
    "Robert.pinto@us.gt.com:Robert Pinto::Insider",
    "todd.flint@cabotcorp.net:Todd::Insider",
    "nick.golding@bristol.ac.uk:Nick Golding::Insider",
    "Melanie.tully@camden.gov.uk:Melanie::Insider",
    "donohue@udel.edu:Chris::Insider",
    "me@erica.toelle.com:Erica::Insider",
    "melinda@boomit.biz:Melinda::Insider",
    "garry@lundhill.co.uk:Garry Trinder::Insider",
    "Yatindra.ranpura@avepoint.com:Yatindra::Insider",
    "adrian.bignell@festo.com:Adrian::Insider",
    "Lisa.martinez@amadeus.com:Lisa::Insider"]

function run(){

    var context =  {
        log : function (txt,p1,p2,p3){
            console.log(txt,p1 ? p1: "",p2 ? p2: "",p3 ? p3: "")
        },
        done : function (err){
            if (err){
                console.log(err);
             //   process.exit(1)
            }else
            {
                if (insiders.length<1) {
                    console.log("Done")
                    process.exit(0)
                }
                console.log("Result",this.res)
                func(context, {
                    body: {
                        action: "addcrm",
                        query: insiders.pop()
                    }
                });
               
        }
        }}
        
        

func(context, {
    body: {
        action: "addcrm",
        query: insiders.pop()
    }
});

}
run()


 