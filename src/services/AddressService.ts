import convert from 'xml-js';

interface AddressResponseData {
  rua: string;
  bairro: string;
  cep: string;
}

export class AddressService {
  public static async getAddressByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<AddressResponseData> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lon=${longitude}&lat=${latitude}`,
      );

      if (response.status != 200) {
        throw new Error(
          'Não foi possível achar as informações desse endereço. Coloque manualmente',
        );
      }

      const xmlText = await response.text();
      const jsonString = convert.xml2json(xmlText, { compact: true });
      const json = JSON.parse(jsonString);
      const address = json.reversegeocode.addressparts;

      const infos: AddressResponseData = {
        bairro: address?.suburb._text || address?.quarter._text,
        rua: address.road._text,
        cep: address.postcode._text,
      };

      return infos;
    } catch (error) {
      throw new Error(
        'Não foi possível buscar as informações desse local selecionado. Tente novamente mais tarde',
      );
    }
  }
}
