import BaseApi from './BaseApi'
import { MasterRaw } from '../stores/master/action'

class MasterApi extends BaseApi {

  /** @Master role */
  public getRole = (token: string) =>
    this.apiGet('dropdown/role', this.setAuthorize(token))

  /** @Master section */
  public getSection = (token: string) =>
    this.apiGet('dropdown/sectionID', this.setAuthorize(token))

  /** @Master templateType */
  public getTemplateType = (token: string) =>
    this.apiGet('dropdown/templateType', this.setAuthorize(token))

  /** @Master destinationType */
  public getDestinationType = (token: string) =>
    this.apiGet('dropdown/destinationType', this.setAuthorize(token))

  /** @Master company */
  public getCompany = (token: string) =>
    this.apiGet('dropdown/company', this.setAuthorize(token))

  /** @Master rebateType */
  public getRebateType = (token: string) =>
    this.apiGet('dropdown/rebateType', this.setAuthorize(token))

  /** @Master customer */
  public getCustomer = (token: string) =>
    this.apiGet('dropdown/masterCustomer', this.setAuthorize(token))

  /** @Master distribution */
  public getDistribution = (token: string) =>
    this.apiGet('dropdown/distribution', this.setAuthorize(token))
 
  // Fetch all master

  public getAllMasterData = async (token: string): Promise<MasterRaw> => {
    const [
      resRole,
      resSection,
      resTemplateType,
      resDestinationType,
      resCompany,
      resRebateType,
      resCustomer,
      resDistribution
    ] = await Promise.all([
      this.getRole(token),
      this.getSection(token),
      this.getTemplateType(token),
      this.getDestinationType(token),
      this.getCompany(token),
      this.getRebateType(token),
      this.getCustomer(token),
      this.getDistribution(token)
    ])

    return {
      role: resRole.isSuccess ? resRole.data : [],
      section: resSection.isSuccess ? resSection.data : [],
      templateType: resTemplateType.isSuccess ? resTemplateType.data : [],
      destinationType: resDestinationType.isSuccess ? resDestinationType.data : [],
      company: resCompany.isSuccess ? resCompany.data : [],
      rebateType: resRebateType.isSuccess ? resRebateType.data : [],
      customer: resCustomer.isSuccess ? resCustomer.data : [],
      distribution: resDistribution.isSuccess ? resDistribution.data : []
    }
  }

}

export const masterApi = new MasterApi()

export default MasterApi