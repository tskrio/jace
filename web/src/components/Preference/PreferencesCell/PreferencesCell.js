import { navigate, routes, useLocation } from '@redwoodjs/router'
import { Fragment, useState } from 'react'
import {
  SimpleGrid,
  Flex,
  Table,
  TableCaption,
  Heading,
  Box,
  Button,
  Spacer,
} from '@chakra-ui/react'
import TableColumns from 'src/components/TableColumns'
import TableQuery from 'src/components/TableQuery'
import TablePagination from 'src/components/TablePagination'
import TableRows from 'src/components/TableRows/TableRows'
import { DELETE_PREFERENCE_MUTATION } from 'src/components/Preference/EditPreferenceCell'
import { MdAdd, MdKeyboardBackspace } from 'react-icons/md'
import TableSkeleton from 'src/components/TableSkeleton/TableSkeleton'

export const beforeQuery = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { search } = useLocation()
  let params = new URLSearchParams(search)
  return {
    variables: {
      q: params.get('q') || props.query,
      filter: params.get('filter') || props.fuzzyQuery,
      skip: params.get('skip') || props.skip || 0,
      take: params.get('take') || props.take || 10,
      orderBy: params.get('orderBy') || props.orderBy,
    },

    fetchPolicy: 'no-cache',
  }
}
// Looks like you have some foreign keys
// ["userId"] you may want to update the query
// below to include the related values
export const QUERY = gql`
  query FindPreferences(
    $filter: String
    $skip: Int
    $take: Int
    $q: String
    $orderBy: OrderByInput
  ) {
    preferences(
      filter: $filter
      skip: $skip
      take: $take
      q: $q
      orderBy: $orderBy
    ) {
      count
      take
      skip
      q
      results {
        id
        createdAt
        updatedAt
        entity
        value
        userId
        user {
          id
          name
        }
      }
    }
  }
`

export const Loading = () => <TableSkeleton />

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({
  preferences,
  fuzzyQuery,
  setFuzzyQuery,
  query,
  setQuery,
  columns,
  initialColumns,
  setColumns,
  orderBy,
  setOrderBy,
  skip,
  setSkip,
  take,
  setTake,
  displayColumn,
  roles,
}) => {
  let [data, setData] = useState(preferences)
  return (
    <Fragment>
      <Heading>Preferences ({data.count})</Heading>
      {/*<Text>orderBy: {JSON.stringify(orderBy).toString()}</Text>
      <Text>query: {JSON.stringify(query).toString()}</Text>
      <Text>fuzzyQuery: {JSON.stringify(fuzzyQuery).toString()}</Text>
      <Text>take: {JSON.stringify(take).toString()}</Text>
      <Text>skip: {JSON.stringify(skip).toString()}</Text>*/}
      <Flex>
        <Box>
          {preferences.q !== null && (
            <Button
              leftIcon={<MdKeyboardBackspace />}
              colorScheme="teal"
              variant="solid"
              onClick={() => {
                setQuery('')
                setFuzzyQuery('')
                navigate(routes.preferences({}))
              }}
            >
              All preferences
            </Button>
          )}
        </Box>
        <Spacer />
        <Button
          leftIcon={<MdAdd />}
          colorScheme="teal"
          variant="solid"
          onClick={() => {
            navigate(routes.newPreference())
          }}
        >
          New preference
        </Button>
      </Flex>
      <TableQuery
        query={query}
        setQuery={setQuery}
        fuzzyQuery={fuzzyQuery}
        setFuzzyQuery={setFuzzyQuery}
        rawQuery={preferences.q}
        inputPlaceholder="Search"
        link={(query) => {
          return routes.preferences({ q: query })
        }}
        setSkip={setSkip}
      />

      <Box
        // mobile
        display={{ sm: 'block', md: 'block', lg: 'none', xl: 'none' }}
      >
        <Table variant="striped" colorScheme={'green'} size="xs">
          <TableCaption>List of Preferences</TableCaption>

          <TableColumns
            columns={columns.reduce(
              (acc, curr, i) =>
                i === 0 || i === columns.length - 1 ? [...acc, curr] : acc,
              []
            )}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            setColumns={setColumns}
            initialColumns={initialColumns}
            setTake={setTake}
          />

          <TableRows
            columns={columns.reduce(
              (acc, curr, i) =>
                i === 0 || i === columns.length - 1 ? [...acc, curr] : acc,
              []
            )}
            roles={roles}
            setData={setData}
            data={data}
            model="preferences"
            deleteMutation={DELETE_PREFERENCE_MUTATION}
            displayColumn={displayColumn}
          />
        </Table>
      </Box>
      <Box
        // desktop
        display={{ sm: 'none', md: 'none', lg: 'block', xl: 'block' }}
      >
        <Table variant="striped" colorScheme={'green'} size="xs">
          <TableCaption>List of Preferences</TableCaption>

          <TableColumns
            columns={columns}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            setColumns={setColumns}
            initialColumns={initialColumns}
            setTake={setTake}
          />

          <TableRows
            columns={columns}
            roles={roles}
            setData={setData}
            data={data}
            model="preferences"
            deleteMutation={DELETE_PREFERENCE_MUTATION}
            displayColumn={displayColumn}
          />
        </Table>
      </Box>
      <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
        <Flex padding="10px"></Flex>
        <Flex padding="10px">
          <TablePagination skip={skip} setSkip={setSkip} take={take} />
        </Flex>
      </SimpleGrid>
    </Fragment>
  )
}
