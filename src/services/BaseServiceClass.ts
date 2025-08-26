export abstract class BaseServiceClass {
  protected readonly serviceUnavailableError = new Error(
    'Serviço indisponível. Tente novamente em instantes'
  );
  protected readonly notFoundError = new Error('Recurso não encontrado.');
  protected readonly createError = new Error('Falha ao criar recurso.');
  protected readonly updateError = new Error('Falha ao atualizar recurso.');
  protected readonly deleteError = new Error('Falha ao deletar recurso.');
  protected readonly serverError = new Error('Erro no servidor. Tente novamente mais tarde.');

}