import { navigate, routes, useLocation } from '@redwoodjs/router'
import { Fragment, useState } from 'react'
import {
  SimpleGrid,
  Flex,
  Table,
  TableCaption,
  Heading,
  Box,
  Spacer,
  Button,
} from '@chakra-ui/react'
import TableColumns from 'src/components/TableColumns'
import TableQuery from 'src/components/TableQuery'
import TablePagination from 'src/components/TablePagination'
import TableRows from 'src/components/TableRows/TableRows'
import { DELETE_PROPERTY_MUTATION } from 'src/components/Property/EditPropertyCell'
import { MdAdd, MdKeyboardBackspace } from 'react-icons/md'
import TableSkeleton from 'src/components/TableSkeleton/TableSkeleton'

export const beforeQuery = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { search } = useLocation()
  let params = new URLSearchParams(search)
  return {
    variables: {
      q: params.get('q'),
      filter: params.get('filter') || props.fuzzyQuery,
      skip: params.get('skip') || props.skip || 0,
      take: params.get('take') || props.take || 10,
      orderBy: params.get('orderBy') || props.orderBy,
    },

    fetchPolicy: 'no-cache',
  }
}
// Looks like you have some foreign keys
// [] you may want to update the query
// below to include the related values
export const QUERY = gql`
  query FindProperties(
    $filter: String
    $skip: Int
    $take: Int
    $q: String
    $orderBy: OrderByInput
  ) {
    properties(
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
        type
        value
      }
    }
  }
`

export const Loading = () => <TableSkeleton />

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({
  properties,
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
  let [data, setData] = useState(properties)
  return (
    <Fragment>
      <Heading>Properties ({data.count})</Heading>
      <Flex>
        <Box>
          {properties.q !== null && (
            <Button
              leftIcon={<MdKeyboardBackspace />}
              colorScheme="teal"
              variant="solid"
              onClick={() => {
                setQuery('')
                setFuzzyQuery('')
                navigate(routes.properties({}))
              }}
            >
              All properties
            </Button>
          )}
        </Box>
        <Spacer />
        <Button
          leftIcon={<MdAdd />}
          colorScheme="teal"
          variant="solid"
          onClick={() => {
            navigate(routes.newProperty())
          }}
        >
          New property
        </Button>
      </Flex>
      <TableQuery
        query={query}
        setQuery={setQuery}
        fuzzyQuery={fuzzyQuery}
        setFuzzyQuery={setFuzzyQuery}
        rawQuery={properties.q}
        inputPlaceholder="Search"
        link={(query) => {
          return routes.properties({ q: query })
        }}
        setSkip={setSkip}
      />

      <Box
        // mobile
        display={{ sm: 'block', md: 'block', lg: 'none', xl: 'none' }}
      >
        <Table variant="striped" colorScheme={'green'} size="xs">
          <TableCaption>List of Properties</TableCaption>

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
            model="properties"
            deleteMutation={DELETE_PROPERTY_MUTATION}
            displayColumn={displayColumn}
          />
        </Table>
      </Box>
      <Box
        // desktop
        display={{ sm: 'none', md: 'none', lg: 'block', xl: 'block' }}
      >
        <Table variant="striped" colorScheme={'green'} size="xs">
          <TableCaption>List of Properties</TableCaption>

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
            model="properties"
            deleteMutation={DELETE_PROPERTY_MUTATION}
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
