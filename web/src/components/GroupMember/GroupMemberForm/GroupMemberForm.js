import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  Submit,
} from '@redwoodjs/forms'
import { useLocation } from '@redwoodjs/router'
const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const GroupMemberForm = (props) => {
  const { search } = useLocation()
  let params = new URLSearchParams(search)
  const onSubmit = (data) => {
    props.onSave(data, props?.groupMember?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>
        <NumberField
          name="userId"
          defaultValue={props.groupMember?.userId || params.get('userId')}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          config={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="groupId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Group id
        </Label>
        <NumberField
          name="groupId"
          defaultValue={props.groupMember?.groupId || params.get('groupId')}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          config={{ required: true }}
        />

        <FieldError name="groupId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default GroupMemberForm
